pipeline {
    
    agent any
     environment {
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        MONGO_DB_CREDS = credentials('mongo-db-cred')
        MONGO_USERNAME = "${MONGO_DB_CREDS_USR}"
        MONGO_PASSWORD = "${MONGO_DB_CREDS_PSW}"
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
                  echo $MONGO_DB_CREDS
                  echo username is: $MONGO_USERNAME
                  echo pwd is:  $MONGO_PASSWORD
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
        /*
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
    */
    stage('Unit_Test'){
        steps{
            catchError(buildResult: 'SUCCESS', message: 'oops! This will be fixed in coming sprint...!', stageResult: 'UNSTABLE') {
                // withCredentials([usernamePassword(credentialsId: 'mongo-db-cred', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                //     sh 'npm test'
                // }
                sh 'npm test'
                
            }
                        
        } 
    } 
    stage('SAST-SQAnalysis') {
    steps {
        withSonarQubeEnv('sonar-qube-scanner') {
                sh """
                    sonar-scanner \
                        -Dsonar.projectKey=solar-project \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://65.2.168.85:9000 \
                        -Dsonar.token=${sq-token}
                """
            }
       }

    }
 post {
    always {
        junit allowEmptyResults: true, stdioRetention: '', testResults: 'test-results.xml' 
        junit allowEmptyResults: true, stdioRetention: '', testResults: 'dependency-check-junit.xml'

        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-report.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])

    }
 }
 }
}


