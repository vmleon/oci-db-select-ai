-- TODO change it to OCI Gen AI

begin
   dbms_network_acl_admin.append_host_ace(
      host => 'api.cohere.ai',
      ace  => xs$ace_type(
         privilege_list => xs$name_list('http'),
         principal_name => 'ADMIN',
         principal_type => xs_acl.ptype_db
      )
   );
end;
/

exit;