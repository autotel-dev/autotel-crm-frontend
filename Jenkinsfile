pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from the main branch on GitHub
                script {
                    git url: 'https://github.com/mindflaretech/Autotel-CRM-Updated.git', credentialsId: '01', branch: 'frontend/bilal'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'echo vm9server | sudo -S npm install --force'
            }
        }
        
        stage('Build') {
            steps {
                /usr/bin/node --max-old-space-size=8192 /var/lib/jenkins/workspace/crmfrontend/node_modules/fork-ts-checker-webpack-plugin/lib/typescript-reporter/reporter/TypeScriptReporterRpcService.js
                sh 'export NODE_OPTIONS=--max-old-space-size=8192 && echo vm9server | sudo -S npm run build --force'
            }
        }
        
        stage('Test') {
            steps {
                // Run tests if you have any
                sh 'echo vm9server | sudo -S npm test --force'
            }
        }
        
        stage('Deploy') {
            steps {
                // Deploy your application to your server
                // You can use SSH, FTP, or any deployment method here
                // For simplicity, let's assume copying files to the server
                sh 'scp -r build /usr/share/nginx/html'
            }
        }
    }
}
