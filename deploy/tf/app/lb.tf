resource "oci_core_public_ip" "public_reserved_ip" {
  compartment_id = var.compartment_ocid
  lifetime       = "RESERVED"

  lifecycle {
    ignore_changes = [private_ip_id]
  }
}

variable "load_balancer_shape_details_maximum_bandwidth_in_mbps" {
  default = 40
}

variable "load_balancer_shape_details_minimum_bandwidth_in_mbps" {
  default = 10
}

resource "oci_load_balancer" "lb" {
  shape          = "flexible"
  compartment_id = var.compartment_ocid

  subnet_ids = [oci_core_subnet.public_subnet.id]

  shape_details {
    maximum_bandwidth_in_mbps = var.load_balancer_shape_details_maximum_bandwidth_in_mbps
    minimum_bandwidth_in_mbps = var.load_balancer_shape_details_minimum_bandwidth_in_mbps
  }

  display_name = "LB Select AI"

  reserved_ips {
    id = oci_core_public_ip.public_reserved_ip.id
  }
}

# resource "oci_load_balancer_backend_set" "lb-backend-set-web" {
#   name             = "lb-backend-set-web"
#   load_balancer_id = oci_load_balancer.lb.id
#   policy           = "ROUND_ROBIN"

#   health_checker {
#     port     = "80"
#     protocol = "HTTP"
#     url_path = "/"
#   }
# }

resource "oci_load_balancer_backend_set" "lb-backend-set-server" {
  name             = "lb-backend-set-server"
  load_balancer_id = oci_load_balancer.lb.id
  policy           = "ROUND_ROBIN"

  health_checker {
    port     = "8080"
    protocol = "HTTP"
    url_path = "/actuator/health"
  }
}

resource "oci_load_balancer_listener" "lb-listener" {
  load_balancer_id         = oci_load_balancer.lb.id
  name                     = "http"
  default_backend_set_name = oci_load_balancer_backend_set.lb-backend-set-server.name
  port                     = 8080
  protocol                 = "HTTP"
  routing_policy_name      = oci_load_balancer_load_balancer_routing_policy.routing_policy.name

  connection_configuration {
    idle_timeout_in_seconds = "2"
  }
}

resource "oci_load_balancer_listener" "listener_ssl" {
  load_balancer_id         = oci_load_balancer.lb.id
  name                     = "https"
  routing_policy_name      = oci_load_balancer_load_balancer_routing_policy.routing_policy.name
  default_backend_set_name = oci_load_balancer_backend_set.lb-backend-set-server.name
  port                     = 443
  protocol                 = "HTTP"

  connection_configuration {
    idle_timeout_in_seconds = "30"
  }

  ssl_configuration {
    certificate_name        = oci_load_balancer_certificate.certificate.certificate_name
    verify_peer_certificate = false
    protocols               = ["TLSv1.1", "TLSv1.2"]
    server_order_preference = "ENABLED"
    cipher_suite_name       = oci_load_balancer_ssl_cipher_suite.ssl_cipher_suite.name
  }
}

resource "oci_load_balancer_rule_set" "rule_set_to_ssl" {
  name             = "rule_set_to_ssl"
  load_balancer_id = oci_load_balancer.lb.id
  items {
    description = "Redirection to SSL"
    action      = "REDIRECT"

    conditions {
      attribute_name  = "PATH"
      attribute_value = "/"

      operator = "FORCE_LONGEST_PREFIX_MATCH"
    }

    redirect_uri {
      port     = 443
      protocol = "HTTPS"
    }
    response_code = 302
  }
}

# resource "oci_load_balancer_backend" "lb-backend-web" {
#   load_balancer_id = oci_load_balancer.lb.id
#   backendset_name  = oci_load_balancer_backend_set.lb-backend-set-web.name
#   ip_address       = module.web.private_ip
#   port             = 80
#   backup           = false
#   drain            = false
#   offline          = false
#   weight           = 1
# }

resource "oci_load_balancer_backend" "lb-backend-server" {
  load_balancer_id = oci_load_balancer.lb.id
  backendset_name  = oci_load_balancer_backend_set.lb-backend-set-server.name
  ip_address       = module.backend.private_ip
  port             = 8080
  backup           = false
  drain            = false
  offline          = false
  weight           = 1
}

resource "oci_load_balancer_load_balancer_routing_policy" "routing_policy" {
  condition_language_version = "V1"
  load_balancer_id           = oci_load_balancer.lb.id
  name                       = "routing_policy"

  rules {
    name      = "routing_to_backend"
    condition = "any(http.request.url.path sw (i '/api'))"
    actions {
      name             = "FORWARD_TO_BACKENDSET"
      backend_set_name = oci_load_balancer_backend_set.lb-backend-set-server.name
    }
  }

  # rules {
  #   name      = "routing_to_frontend_assets"
  #   condition = "any(http.request.url.path sw (i '/assets'))"
  #   actions {
  #     name             = "FORWARD_TO_BACKENDSET"
  #     backend_set_name = oci_load_balancer_backend_set.lb-backend-set-web.name
  #   }
  # }

  # rules {
  #   name      = "routing_to_frontend"
  #   condition = "any(http.request.url.path eq (i '/'))"
  #   actions {
  #     name             = "FORWARD_TO_BACKENDSET"
  #     backend_set_name = oci_load_balancer_backend_set.lb-backend-set-web.name
  #   }
  # }
}

resource "oci_load_balancer_certificate" "certificate" {
  certificate_name = "${local.project_name}.victormartin.dev"
  load_balancer_id = oci_load_balancer.lb.id

  ca_certificate     = file(var.cert_fullchain)
  private_key        = file(var.cert_private_key)
  public_certificate = file(var.cert_fullchain)

}

resource "oci_load_balancer_ssl_cipher_suite" "ssl_cipher_suite" {
  name             = "ssl_cipher_suite"
  ciphers          = ["AES128-SHA", "AES256-SHA"]
  load_balancer_id = oci_load_balancer.lb.id
}