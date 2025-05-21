#!/bin/bash

# Create secrets directory if it doesn't exist
mkdir -p secrets

# Read values from .env file
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Create secret files
echo "$PORT" > secrets/port.txt
echo "$ATLAS_CONNECTION_STRING" > secrets/atlas_connection_string.txt
echo "$GEMINI_API_KEY" > secrets/gemini_api_key.txt

# Set appropriate permissions
chmod 600 secrets/*.txt

echo "Secrets have been set up successfully" 