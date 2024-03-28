pipeline {
    agent any
    
    environment {
        NODE_OPTIONS = '--max-old-space-size=8192'
        CI = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    echo 'Checking out code...'
                    git url: 'https://github.com/mindflaretech/Autotel-CRM-Updated.git', credentialsId: '01', branch: 'main'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh 'npm install --force'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo 'Building...'
                    sh 'npm run build --force'
                }
            }
        }
        
        // stage('Test') {
        //     steps {
        //         script {
        //             echo 'Running tests...'
        //             sh 'npm test --force'
        //         }
        //     }
        // }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying...'
                    sh 'sudo scp -r build /usr/share/nginx/html/'
                }
            }
        }
    }
}
