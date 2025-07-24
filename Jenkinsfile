pipeline {
    agent any

    // environment {
    //     // Đặt các biến môi trường cần thiết ở đây nếu có
    //     // Ví dụ: NODE_ENV = 'test'
    // }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Setup Node & pnpm') {
            steps {
                dir('backend') {
                    // Cài đặt Node.js và pnpm nếu Jenkins chưa có sẵn
                    sh 'node -v'
                    sh 'pnpm -v'
                }
            }
        }
        stage('Install dependencies') {
            steps {
                dir('backend') {
                    sh 'pnpm install'
                }
            }
        }
        stage('Lint') {
            steps {
                dir('backend') {
                    sh 'pnpm lint'
                }
            }
        }
        stage('Unit Test') {
            steps {
                dir('backend') {
                    sh 'pnpm test'
                }
            }
        }
        stage('Test Coverage') {
            steps {
                dir('backend') {
                    sh 'pnpm test:cov'
                    sh '''
                        if ! command -v jq > /dev/null; then
                          apt-get update && apt-get install -y jq bc
                        fi
                        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
                        echo "Line coverage: $COVERAGE%"
                        if (( $(echo "$COVERAGE < 40" | bc -l) )); then
                          echo "Coverage is below threshold of 40%!" >&2
                          exit 1
                        else
                          echo "Coverage meets threshold."
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            emailext to: 'npkhang287@gmail.com',
                    subject: "Jenkins Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Good news! The build succeeded.\nCheck details at: ${env.BUILD_URL}"
        }
        failure {
            emailext to: 'npkhang287@gmail.com',
                    subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: "Unfortunately, the build failed.\nCheck details at: ${env.BUILD_URL}"
        }
    }
}