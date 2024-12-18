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
        echo "coming soon!!"
            }
        }
    stage ('Build-Image') {
        steps{
            sh 'docker build -t asoni007/nodejs-solar:$GIT_COMMIT .'
        }
    }
    stage('Trivy-Vulnerability-Scanner'){
        steps{
            script {
            sh '''
               trivy image asoni007/nodejs-solar:$GIT_COMMIT \
               --severity LOW,MEDIUM,HIGH \
               --exit-code 0 \
               --quiet \
               --format json -o trivy-image-MEDIUM-results.json

               trivy image asoni007/nodejs-solar:$GIT_COMMIT \
               --severity CRITICAL \
               --exit-code 0 \
               --quiet \
               --format json -o trivy-image-CRITICAL-results.json
            '''
            }   

        }
        post {
            always {
                sh '''
                trivy convert \
                    --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                        --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json 

                trivy convert \
                    --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                    --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

                trivy convert \
                    --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                    --output trivy-image-MEDIUM-results.xml  trivy-image-MEDIUM-results.json 

                trivy convert \
                    --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                    --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json 
            '''
            }
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



