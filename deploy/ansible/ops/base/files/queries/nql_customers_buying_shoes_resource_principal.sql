EXEC DBMS_CLOUD_AI.set_profile('GENAI_CRED_RESOURCE_PRINCIPAL');

select dbms_cloud_ai.generate(
   prompt       => 'show the top 10 customers who are buying Hardware',
   profile_name => 'GENAI_CRED_RESOURCE_PRINCIPAL',
   action       => 'showsql'
) as query
  from dual;

exit;