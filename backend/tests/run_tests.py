import os
import sys

import pytest


def run_system_audit():
    """
    Executes the full suite of technical tests and integration audits
    for the ElectraLearn platform.
    """
    print("🚀 INITIALIZING ELECTRALEARN SYSTEM AUDIT...")
    print("-" * 50)

    # Define the test directory
    test_dir = os.path.dirname(os.path.abspath(__file__))

    # Run pytest with high-fidelity output
    # -v: Verbose
    # -s: Show stdout
    exit_code = pytest.main(["-v", "--tb=short", test_dir])

    if exit_code == 0:
        print("\n✅ AUDIT COMPLETE: ALL SYSTEMS NOMINAL (100% INTEGRITY)")
    else:
        print(
            f"\n⚠️ AUDIT COMPLETE: SYSTEM ENCOUNTERED {exit_code} ANOMALIES (RECALIBRATING...)"
        )

    return exit_code


if __name__ == "__main__":
    sys.exit(run_system_audit())
