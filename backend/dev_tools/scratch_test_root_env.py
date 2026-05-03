import os

from dotenv import dotenv_values, load_dotenv


def test_dotenv():
    print("Testing root .env...")
    try:
        config = dotenv_values("../.env")
        for k, v in config.items():
            print(f"Setting {k}...")
            os.environ[k] = v
        print("Success!")
    except Exception as e:
        print(f"FAILED on key: {k}")
        print(f"Error: {e}")


if __name__ == "__main__":
    test_dotenv()
