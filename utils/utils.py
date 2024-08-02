# common.py or utils.py

class Result:
    def __init__(self, value=None, error=None):
        self.value = value
        self.error = error
        self.is_success = error is None

    @property
    def is_failure(self):
        return not self.is_success
