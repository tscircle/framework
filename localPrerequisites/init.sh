# AWS Credentials
mkdir ~/.aws
printf "[default]\naws_access_key_id = DEFAULT_ACCESS_KEY\naws_secret_access_key = DEFAULT_SECRET_KEY" >> ~/.aws/credentials
printf "[default]\nregion = eu-central-1" >> ~/.aws/config

# DynamoDB
aws dynamodb --endpoint-url http://dynamodb:8000 create-table --cli-input-json file://dynamoDbCacheTable.json --region eu-central-1
aws dynamodb --endpoint-url http://dynamodb:8000 update-time-to-live --table-name cache --time-to-live-specification "Enabled=true, AttributeName=ttl" --region eu-central-1

#SQS
aws sqs create-queue --queue-name sqs-dlq --endpoint-url http://sqs:9324 --region eu-central-1
aws sqs create-queue --queue-name sqs --endpoint-url http://sqs:9324 --region eu-central-1
#aws sqs set-queue-attributes --queue-url http://sqs:9324/queue/sqs --endpoint-url http://sqs:9324 --attributes '{"RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:elasticmq:000000000000:sqs-dlq\",\"maxReceiveCount\":\"1\"}"}'

