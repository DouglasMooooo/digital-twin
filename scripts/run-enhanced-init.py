#!/usr/bin/env python3
"""
Quick test runner for enhanced vector initialization.
This script can be called via HTTP to bypass terminal issues.
"""
import subprocess
import sys
import json
from pathlib import Path

def run_enhanced_init():
    """Run the enhanced vector initialization script"""
    script_path = Path(__file__).parent / 'init-vector-enhanced.py'
    
    try:
        result = subprocess.run(
            [sys.executable, str(script_path)],
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes max
        )
        
        return {
            'success': result.returncode == 0,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': 'Script execution timed out after 5 minutes'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    result = run_enhanced_init()
    print(json.dumps(result, indent=2, ensure_ascii=False))
