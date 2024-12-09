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
        stage('Install_Dependency'){
            steps {
                sh 'npm install --no-audit'
            }
        }
        stage('OWASP Dependency-Check Vulnerabilities') {
      steps {
        dependencyCheck additionalArguments: ''' 
                    -o './'
                    -s './'
                    -f 'ALL' 
                    --prettyPrint''', odcInstallation: 'dependency-check-11.0.0'
        
        dependencyCheckPublisher pattern: 'dependency-check-report.xml'
      }
    }
    }
}