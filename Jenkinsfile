pipeline {
    agent any
    stages {
        stage("Build") {
            steps {
                {
                    script {
                        sh "docker build --target final \
                        -t docker_hub/dns-proxy-tls:$BRANCH_NAME-$BUILD_NUMBER \
                        -t docker_hub/dns-proxy-tls:$BRANCH_NAME-latest ."
                        sh "docker build --target lint \
                        -t docker_hub/dns-proxy-tls:$BRANCH_NAME-$BUILD_NUMBER-lint"
                    }
                }
            }
        }
        stage("Test") {
            steps {
                parallel(
                    lint: {
                        sh "docker run --rm docker_hub/dns-proxy-tls:$BRANCH_NAME-$BUILD_NUMBER-lint npm run lint"
                    }
                )
            }
        }
        stage("Push Image") {
            steps {
                sh "docker push docker_hub/dns-proxy-tls:$BRANCH_NAME-$BUILD_NUMBER"
                sh "docker push docker_hub/dns-proxy-tls:$BRANCH_NAME-latest"
            }
        }
        stage("Deploy Development") {
            when {
                not {
                    branch 'master'
                }
            }
            steps {
                withCredentials([file(credentialsId: 'kubernetes-credentials', variable: 'KUBECONFIG')]) {
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=development set image deployment/dns-proxy dns-proxy=docker_hub/dns-proxy-tls:${BRANCH_NAME}-${BUILD_NUMBER}"
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=development --timeout=3m rollout status deployment/dns-proxy"
                }
            }
        }
        stage("Deploy Staging") {
            when {
                branch 'master'
            }
            steps {
                withCredentials([file(credentialsId: 'kubernetes-credentials', variable: 'KUBECONFIG')]) {
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=staging set image deployment/dns-proxy dns-proxy=docker_hub/dns-proxy-tls:${BRANCH_NAME}-${BUILD_NUMBER}"
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=staging --timeout=3m rollout status deployment/dns-proxy"
                }
            }
        }
        stage("Deploy Production") {
            when {
                beforeInput true
                branch 'master'
            }
            input {
                message "Do you want to Deploy to Production?"
                ok "Yes"
                submitter "albertorojasm95"
            }
            steps {
                withCredentials([file(credentialsId: 'kubernetes-credentials', variable: 'KUBECONFIG')]) {
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=production set image deployment/dns-proxy dns-proxy=docker_hub/dns-proxy-tls:${BRANCH_NAME}-${BUILD_NUMBER}"
                    sh "kubectl --kubeconfig=${KUBECONFIG} --namespace=production --timeout=3m rollout status deployment/dns-proxy"
                }
            }
        }
    }
}
