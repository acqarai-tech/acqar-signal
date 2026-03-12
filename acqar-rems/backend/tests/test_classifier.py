import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from data_pipeline.processors.classifier import EventClassifier
import pytest

@pytest.fixture
def classifier():
    return EventClassifier()

def test_classify_transaction(classifier):
    article = {
        'id': 'test1',
        'title': 'Villa Sold for AED 25 Million in Palm Jumeirah',
        'summary': 'A luxury villa was sold by Emaar for AED 25 million, setting a new record for the area.',
        'source': 'Gulf News',
        'source_weight': 0.9,
        'published_at': '2024-01-01T00:00:00Z'
    }
    result = classifier.classify(article)
    assert result['category'] == 'transaction'
    assert result['severity'] >= 3
    assert result['price_aed'] == 25_000_000
    assert result['location_name'] == 'Palm Jumeirah'
    assert result['developer'] == 'Emaar'

def test_classify_regulatory(classifier):
    article = {
        'id': 'test2',
        'title': 'RERA Issues New Regulation on Short-Term Rental Properties',
        'summary': 'Dubai RERA announces new regulations and policy changes for holiday homes.',
        'source': 'The National',
        'source_weight': 0.9,
        'published_at': '2024-01-01T00:00:00Z'
    }
    result = classifier.classify(article)
    assert result['category'] == 'regulatory'
    assert result['confidence'] > 0.5

def test_classify_offplan(classifier):
    article = {
        'id': 'test3',
        'title': 'DAMAC Launches New Off-Plan Development in Business Bay',
        'summary': 'DAMAC announces the launch of a new off-plan tower in Business Bay, Dubai.',
        'source': 'Arabian Business',
        'source_weight': 0.8,
        'published_at': '2024-01-01T00:00:00Z'
    }
    result = classifier.classify(article)
    assert result['category'] == 'offplan'
    assert result['developer'] == 'DAMAC'
    assert result['location_name'] == 'Business Bay'

def test_location_detection(classifier):
    article = {
        'id': 'test4',
        'title': 'New Project Launches in Dubai Marina',
        'summary': 'A new residential project was announced in Dubai Marina area.',
        'source': 'Test',
        'source_weight': 0.7,
        'published_at': '2024-01-01T00:00:00Z'
    }
    result = classifier.classify(article)
    assert result['location_name'] == 'Dubai Marina'
    assert abs(result['lat'] - 25.0761) < 0.01
    assert abs(result['lng'] - 55.1403) < 0.01

def test_severity_calculation(classifier):
    high_severity = {
        'id': 'test5',
        'title': 'Record AED 1 Billion Deal: Landmark Transaction in Downtown Dubai',
        'summary': 'Historic billion-dirham deal sets new record for Downtown Dubai.',
        'source': 'Test',
        'source_weight': 0.9,
        'published_at': '2024-01-01T00:00:00Z'
    }
    result = classifier.classify(high_severity)
    assert result['severity'] >= 4

def test_batch_classify(classifier):
    articles = [
        {'id': f'batch{i}', 'title': f'Dubai property news {i}', 'summary': 'Real estate update',
         'source': 'Test', 'source_weight': 0.7, 'published_at': '2024-01-01T00:00:00Z'}
        for i in range(5)
    ]
    results = classifier.classify_batch(articles)
    assert len(results) == 5
    for r in results:
        assert 'category' in r
        assert 'severity' in r
        assert 1 <= r['severity'] <= 5
