begin
   dbms_network_acl_admin.append_host_ace(
      host => 'oraclecloud.com',
      ace  => xs$ace_type(
         privilege_list => xs$name_list('http'),
         principal_name => 'ADMIN',
         principal_type => xs_acl.ptype_db
      )
   );
end;
/

exit;