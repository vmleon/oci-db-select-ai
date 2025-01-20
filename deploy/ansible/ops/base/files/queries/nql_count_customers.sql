EXEC DBMS_CLOUD_AI.set_profile('GENAI');

select dbms_cloud_ai.generate(
   prompt       => 'what is the total number of customers',
   profile_name => 'GENAI',
   action       => 'showsql'
) as query
  from dual;

exit;