EXEC DBMS_CLOUD_AI.set_profile('GENAI');

select dbms_cloud_ai.generate(
   prompt       => 'show the customers who are buying Shoes',
   profile_name => 'GENAI',
   action       => 'showsql'
) as query
  from dual;

exit;