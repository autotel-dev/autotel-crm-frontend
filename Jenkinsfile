pipeline {
    agent any
    
    environment {
        NODE_OPTIONS = '--max-old-space-size=8192',
        CI = 'true'
    }

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
