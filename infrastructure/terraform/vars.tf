variable "resource_group_name" {
  type        = string
  description = "RG name in Azure"
  default = "survey-rg"
}

variable "location" {
  type        = string
  description = "Resources location in Azure"
  default = "West Europe"
}

variable "cluster_name" {
  type        = string
  description = "AKS name in Azure"
  default = "survey-app-aks"
}

# variable "kubernetes_version" {
#   type        = string
#   description = "Kubernetes version"
# }

variable "system_node_count" {
  type        = number
  description = "Number of AKS worker nodes"
  default = 3
}

variable "acr_name" {
  type        = string
  description = "ACR name"
  default = "surveyappacr"
}
