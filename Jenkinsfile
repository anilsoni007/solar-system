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
        stage('Dependency_Audit') {
            steps{
                sh '''
                npm audit --audit-level=critical
                if [ $? -eq 0 ]; then
                    echo "No critical vulnerabilities found."
                else
                    echo "Please fix the critical vulnerabilities found in dependency audit."
                fi
                '''
            }
        }
        stage('OWASP Dependency-Check-Vulnerabilities') {
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