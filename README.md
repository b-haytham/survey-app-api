# Survey app microservice 
## Typescript, Expressjs, Docker,  Kubernetes (azure kubernetes service), Terraform, github actions



# Getting started

## local
--------
### Prequisites

1. install [docker](https://docs.docker.com/engine/install/ubuntu/)

2. install [minikube](https://minikube.sigs.k8s.io/docs/start/)

4. install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

5. install [skaffold](https://skaffold.dev/docs/install/)


clone the repo and cd to folder

```bash
git clone https://github.com/b-haytham/survey-app-api.git && cd survey-app-api
```

start minikube kubernetes cluster
```bash
minikube start
```

enable minikube ingess addon 
 
```bash
minikube addons enable ingess
```

get cluster EXTERNAL_IP

```bash
minikube ip
```

add this line to `/etc/hosts`
```bash
<EXTERNAL_IP> survey.dev
```


apply secret objects needed for microserices

```bash
kubectl create secret generic jsonwebtoken-secret --from-literal=JWT_SECRET=<longstringsecret>
```

```bash
kubectl create secret generic cookie-secret --from-literal=COOKIE_SECRET=<longstringsecret>
```

set minikube env

```bash
eval $(minikube docker-env)
```

run project 

```bash
skaffold dev
```

after buiding images and stabilizing deployment test the app 

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"name","password":"password", email: email@email.com}' \
  https://survey.dev/api/organizations/register
```

## Azure kubernetes service

-----
### Prequisites

1. install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

2. install [azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

3. install [terraform](https://www.terraform.io/downloads.html)

4. install [helm]()

login azure

```bash
az login
```

before provisioning the cluster change variables names to your need in `./infrastructure/terraform/vars.tf`

provision kubernetes cluster and container registery attach to it

```bash
terraform init
terraform plan
terraform apply
```

connect to your cluster

```bash
az aks get-credentials --resource-group <YOUR_CLUSTER_RESOURCE_GROUP> --name <YOUR_CLUSTER_NAME>
```

deploy nginx ingress controller

```bash
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Use Helm to deploy an NGINX ingress controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

create azure storage account 

```bash
    az storage account create \
    --name <account-name> \
    --resource-group <resource-group-name> \
    --location westus \
    --sku Standard_LRS \
    --kind StorageV2
```


variable to change in `infrastructure/remote-aks/` :

* location and storage account name in `admin-azure-hdd.yaml` eg. 'westus'
* cookie secret in `coookie-secret.yaml`
* jwt secret in `jwt-secret.yaml`
* azure container registry server name in `users/users-depl.yaml`
* azure container registry server name in `survey/survey-depl.yaml`
* azure container registry server name in `mailer/mailer-depl.yaml`
* azure container registry server name in `organizations/organization-depl.yaml`
* azure container registry server name in `admins/admins-depl.yaml`


create k8s wokloads

```
kubectl apply -f remote-aks -f remote-aks/admins -f remote-aks/mailer -f remote-aks/organizations -f remote-aks/survey -f remote-aks/users 
```
