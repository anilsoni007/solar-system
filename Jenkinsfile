pipeline {
    agent any
    tools {
        nodejs 'nodejs-22-9-0'
    }
    stages {
        stage('Node_Version') {
            steps {
                sh '''
                  node -v
                  npm -v
                  '''
            }
        }
    }
}