variable "location" {
  type    = string
  default = "East US"
}

variable "kubernetes_version" {
  default = "1.18.10"
}

variable "acr_sku" {
  default = "Basic"
}


variable log_analytics_workspace_sku {
  description = "The pricing SKU of the Log Analytics workspace."
  default     = "PerGB2018"
}


variable "cluster-name" {
  type    = string
  default = "survey-app"
}
