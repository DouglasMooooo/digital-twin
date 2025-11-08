#!/bin/bash

# Simple Upstash Vector test
echo "🔍 Testing Upstash Vector connection..."

# Load env file
source .env.local 2>/dev/null || source ../.env.local 2>/dev/null || {
  echo "❌ Cannot find .env.local file"
  exit 1
}

if [ -z "$UPSTASH_VECTOR_REST_URL" ] || [ -z "$UPSTASH_VECTOR_REST_TOKEN" ]; then
  echo "❌ Missing Upstash credentials"
  exit 1
fi

echo "✓ Found credentials"
echo "URL: ${UPSTASH_VECTOR_REST_URL:0:50}..."

# Test with a simple vector (384 dimensions)
VECTOR="["
for i in {1..384}; do
  if [ $i -gt 1 ]; then
    VECTOR="$VECTOR,"
  fi
  VECTOR="$VECTOR$(echo "scale=6; $RANDOM / 32768" | bc)"
done
VECTOR="$VECTOR]"

# Create test data
TEST_DATA=$(cat <<EOF
{
  "vectors": [
    {
      "id": "test-1",
      "vector": $VECTOR,
      "metadata": {
        "type": "test",
        "content": "This is a test vector"
      }
    }
  ]
}
EOF
)

echo ""
echo "📤 Sending test vector to Upstash..."
echo "Vector dimensions: 384"

# Send to Upstash
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $UPSTASH_VECTOR_REST_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$UPSTASH_VECTOR_REST_URL/upsert")

echo "Response: $RESPONSE"

# Parse response
if echo "$RESPONSE" | grep -q '"error"'; then
  echo "❌ Error from Upstash: $RESPONSE"
  exit 1
elif echo "$RESPONSE" | grep -q '"result"'; then
  echo "✅ Test successful!"
  exit 0
else
  echo "⚠️  Unexpected response: $RESPONSE"
  exit 1
fi
