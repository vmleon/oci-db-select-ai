# Notes

## User API Key errors, Common configuration

Autonomous Database Shared, OLTP 23ai.

User with API Key, no Auth issue.

---

`create_profile.sql`

```
begin
   dbms_cloud.create_credential(
      credential_name => 'GENAI_CRED',
      user_ocid       => 'ocid1.user.oc1..aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      tenancy_ocid    => 'ocid1.tenancy.oc1..aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      private_key     => '-----BEGIN PRIVATE KEY----- XXX...XXX== -----END PRIVATE KEY----- ',
      fingerprint     => 'ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff:ff'
   );
end;
/
```

## Error `cohere.command-r-08-2024` does not support `TextGeneration`

`create_profile.sql`

```
begin

   dbms_cloud_ai.drop_profile('GENAI', TRUE);

   dbms_cloud_ai.create_profile(
      profile_name => 'GENAI',
      attributes   => '{
         "provider": "oci",
         "credential_name": "GENAI_CRED",
         "object_list": [
                        {"owner": "SH", "name": "customers"},
                        {"owner": "SH", "name": "countries"},
                        {"owner": "SH", "name": "supplementary_demographics"},
                        {"owner": "SH", "name": "profits"},
                        {"owner": "SH", "name": "promotions"},
                        {"owner": "SH", "name": "products"}],
         "oci_compartment_id": "ocid1.compartment.oc1..aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
         "region": "eu-frankfurt-1",
         "model": "cohere.command-r-08-2024",
         "oci_runtimetype": "COHERE"
       }'
   );
end;
/
```

---

`nql_count_customers.sql`

```
EXEC dbms_cloud_ai.set_profile('GENAI');

select dbms_cloud_ai.generate(
   prompt       => 'what is the total number of customers',
   profile_name => 'GENAI',
   action       => 'showsql'
) as query
  from dual;
```

#### ERROR message

`cohere.command-r-08-2024 does not support TextGeneration`

```
Error at Command Line : 3 Column : 8 File @ /home/opc/queries/nql_count_customers.sql
Error report -
SQL Error: ORA-20400: Request failed with status HTTP 400 - https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com/20231130/actions/generateText
Error response - { "code": "400", "message": "cohere.command-r-08-2024 does not support TextGeneration" }
ORA-06512: at "C##CLOUD$SERVICE.DBMS_CLOUD", line 2096
ORA-06512: at "C##CLOUD$SERVICE.DBMS_CLOUD_AI", line 10707
ORA-06512: at line 1
```

## Error: `ORA-20404`: `Object not found`

`create_profile.sql`

```
begin

   dbms_cloud_ai.drop_profile('GENAI', TRUE);

   dbms_cloud_ai.create_profile(
      profile_name => 'GENAI',
      attributes   => '{
         "provider": "oci",
         "credential_name": "GENAI_CRED",
         "object_list": [
                        {"owner": "SH", "name": "customers"},
                        {"owner": "SH", "name": "countries"},
                        {"owner": "SH", "name": "supplementary_demographics"},
                        {"owner": "SH", "name": "profits"},
                        {"owner": "SH", "name": "promotions"},
                        {"owner": "SH", "name": "products"}],
         "oci_compartment_id": "ocid1.compartment.oc1..aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
         "region": "eu-frankfurt-1",
         "oci_apiformat": "GENERIC"
       }'
   );
end;
/
```

---

`nql_count_customers.sql`

```
EXEC dbms_cloud_ai.set_profile('GENAI');

select dbms_cloud_ai.generate(
   prompt       => 'what is the total number of customers',
   profile_name => 'GENAI',
   action       => 'showsql'
) as query
  from dual;
```

#### ERROR message

`ORA-20404: Object not found`

```
Error at Command Line : 3 Column : 8 File @ /home/opc/queries/nql_count_customers.sql
Error report -
SQL Error: ORA-20404: Object not found - https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com/20231130/actions/chat
ORA-06512: at "C##CLOUD$SERVICE.DBMS_CLOUD", line 2096
ORA-06512: at "C##CLOUD$SERVICE.DBMS_CLOUD_AI", line 10707
ORA-06512: at line 1
```
