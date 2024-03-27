pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    git url: 'https://github.com/mindflaretech/Autotel-CRM-Updated.git', credentialsId: '01', branch: 'main'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install --force'
            }
        }
        
        stage('Build') {
            steps {
                // Set max-old-space-size to 8192
                sh '/usr/bin/node --max-old-space-size=8192 /var/lib/jenkins/workspace/crmfrontend/node_modules/fork-ts-checker-webpack-plugin/lib/typescript-reporter/reporter/TypeScriptReporterRpcService.js'
                
                sh 'npm run build --force'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test --force'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'scp -r build /usr/share/nginx/html'
            }
        }
    }
}
