pipeline{
    environment{
            backend_image = ""
            frontend_image= ""
            //registryCredential='docker'
    }
    agent any
    stages{
        stage('Stage 1: Git Clone'){
            steps{
                git branch: 'main', url: 'https://github.com/utkarsh78/MajorProject_JobHive.git'
            }
        }
        
        stage('Stage 2: Build Docker Server'){
            steps{
                dir("backend"){
                    script{
                        backend_image= docker.build "utkarsh67/jobhive_backend:latest"
                    }
                }
            }
        }
        stage('Stage 3: Build Docker Client'){
            steps{
                dir("frontend"){
                    script{
                        frontend_image= docker.build "utkarsh67/jobhive_frontend:latest"
                    }
                }
            }
        }
        stage('Stage 4:Backend Testing'){
            steps{
                dir("backend"){
                    sh 'npm i'
                    sh 'npm test'
                }
            }
        }
        
        stage('Stage 5:Frontend Testing'){
            steps{
                dir("frontend"){
                    sh 'npm i --force'
                    sh 'npm test'
                }
            }
        }
        
        
        stage('Stage 6: Push Server Docker Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'DockerID') {
                        backend_image.push()
                    }
                }
            }
        }
        stage('Stage 7: Push Client Docker Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'DockerID') {
                        frontend_image.push()
                    }
                }
            }
        }
        
        stage('Stage 8 : Delete Docker Image'){
            steps {
                script {
                    sh '''
                    # Get the IDs of images with the tag <none>
                    NONE_IMAGES=$(docker images | grep "<none>" | awk '{print $3}')
                    
                    # Delete the containers associated with the <none> images
                    for IMAGE in $NONE_IMAGES
                    do
                      # Get the container IDs corresponding to image
                      CONTAINER_IDS=$(docker ps -a | grep $IMAGE | awk '{print $1}')

                    for CON_ID in $CONTAINER_IDS
                    do
                        docker rm --force $CON_ID
                    done

                    # Delete all of the <none> images
                    for IMAGE in $NONE_IMAGES
                    do
                      docker rmi --force $IMAGE
                    done
                   done
                '''
                }
            }
        }
        
        stage('Stage 9: Ansible Deployment to machine'){
            steps{
                
                //ansiblePlaybook becomeUser: 'null', colorized: true, credentialsId: 'docker', installation: 'Ansible', inventory: 'deploy-docker/inventory', playbook: 'deploy-docker/deploy-docker.yml', sudoUser: 'null'
                ansiblePlaybook disableHostKeyChecking: true, credentialsId: 'InventoryID', inventory: 'Deploydocker/inventory', playbook: 'Deploydocker/deploy-docker.yml'
            }          
        }   
    }
}
