pipeline {
    agent any

    environment {
        // Đặt các biến môi trường cần thiết ở đây nếu có
        // Ví dụ: NODE_ENV = 'test'
    }

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
            emailext(
                to: 'npkhang22@clc.fitus.edu.vn',
                subject: "✅ [SUCCESS] ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    ✅ Jenkins build *succeeded*!

                    🔧 Project: ${env.JOB_NAME}
                    🔢 Build number: #${env.BUILD_NUMBER}
                    🌿 Branch: ${env.GIT_BRANCH}
                    📦 Commit: ${env.GIT_COMMIT}
                    🕒 Duration: ${currentBuild.durationString}
                    
                    🔗 Build URL: ${env.BUILD_URL}

                    -- Jenkins Pipeline
                """
            )
        }
        failure {
            emailext(
                to: 'npkhang22@clc.fitus.edu.vn',
                subject: "❌ [FAILURE] ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    ❌ Jenkins build *failed*!

                    🔧 Project: ${env.JOB_NAME}
                    🔢 Build number: #${env.BUILD_NUMBER}
                    🌿 Branch: ${env.GIT_BRANCH}
                    📦 Commit: ${env.GIT_COMMIT}
                    🕒 Duration: ${currentBuild.durationString}
                    
                    🔍 Check logs & console output for more info:
                    ${env.BUILD_URL}

                    -- Jenkins Pipeline
                """
            )
        }
    }
}