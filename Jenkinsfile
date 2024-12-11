pipeline {
    agent any
     environment {
        MONGO_URI = "mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@supercluster.d83jj.mongodb.net/superData?authSource=admin"
    }
    tools {
        nodejs 'nodejs-23-3-0'
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
                   echo $?
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
        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        junit allowEmptyResults: true, stdioRetention: '', testResults: 'dependency-check-junit.xml'
      }
    }
    stage('Unit_Test'){
        steps{
            withCredentials([usernamePassword(credentialsId: 'mongo-db-cred', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                sh 'npm test'
            }
            junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml'             
        }
    }
    }
}
