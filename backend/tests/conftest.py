import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app



@pytest.fixture
def client():
    """
    Test client for executing API requests.
    """
    with TestClient(app) as c:
        yield c

@pytest.fixture
def mock_ai_cluster(mocker):
    """
    Mock for the AI cluster's generation method globally.
    """
    return mocker.patch("app.services.ai_cluster.GenAICluster.generate")

