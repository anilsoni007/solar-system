pipeline {
    agent any
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