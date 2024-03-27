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
                sh 'npm install --force'
                // Install ts-node as a dev dependency
                sh 'npm install ts-node --save-dev --force'
            }
        }
        
        stage('Build') {
            steps {
                // Run TypeScript file with ts-node and set max-old-space-size
                sh '/usr/bin/node --max-old-space-size=8192 ./node_modules/ts-node/dist/bin.js src/index.tsx'
                sh 'npm run build --force'
            }
        }
        
        stage('Test') {
            steps {
                // Run tests if you have any
                sh 'npm test --force'
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
