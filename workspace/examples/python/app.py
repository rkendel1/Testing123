"""
Simple Hello World Python application
This demonstrates Python in the development environment
"""

import sys
import platform


def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}! Welcome to the Development Studio."


def main():
    """Main application entry point."""
    print("Hello from Development Studio!")
    print(f"Python version: {sys.version}")
    print(f"Platform: {platform.platform()}")
    
    # Test the function
    print(greet("Developer"))
    
    # Example list comprehension
    numbers = [x ** 2 for x in range(1, 6)]
    print(f"Squares of 1-5: {numbers}")


if __name__ == "__main__":
    main()
