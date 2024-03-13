pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from GitHub
                script {
                    git url: 'https://github.com/mindflaretech/Autotel-CRM-Updated.git', credentialsId: '01'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // Build the React project
                sh 'npm run build --force'
            }
        }
        
        stage('Test') {
            steps {
                // Run tests if you have any
                sh 'npm test'
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
