import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      upstashUrl: process.env.UPSTASH_VECTOR_REST_URL ? '✓ Set' : '✗ Missing',
      upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN ? '✓ Set' : '✗ Missing',
      groqKey: process.env.GROQ_API_KEY ? '✓ Set' : '✗ Missing',
    },
  };

  // Try to read digitaltwin.json
  try {
    // Note: In runtime, this path may vary. For now, just report that we tried.
    diagnostics.digitaltwinFile = {
      status: 'Check required - file import varies by environment',
    };
  } catch (err) {
    diagnostics.digitaltwinFile = {
      status: 'Error',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  // Try to connect to Upstash
  let upstashStatus = {
    status: 'Not tested',
    message: '',
  };

  if (process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
    try {
      // Test with a simple vector info request
      const response = await fetch(
        `${process.env.UPSTASH_VECTOR_REST_URL}/info`,
        {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        upstashStatus = {
          status: 'Connected',
          message: `Index info received (${JSON.stringify(data).length} bytes)`,
        };
      } else {
        const text = await response.text();
        upstashStatus = {
          status: 'Connection failed',
          message: `HTTP ${response.status}: ${text.substring(0, 100)}`,
        };
      }
    } catch (err) {
      upstashStatus = {
        status: 'Error',
        message: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  } else {
    upstashStatus = {
      status: 'Credentials missing',
      message: 'Set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN',
    };
  }

  diagnostics.upstash = upstashStatus;

  return NextResponse.json(diagnostics);
}
