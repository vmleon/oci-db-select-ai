select channel_desc,
       to_char(
          sum(amount_sold),
          '9,999,999,999'
       ) sales$,
       rank()
       over(
           order by sum(amount_sold)
       ) as default_rank,
       rank()
       over(
           order by sum(amount_sold) desc nulls last
       ) as custom_rank
  from sh.sales,
       sh.products,
       sh.customers,
       sh.times,
       sh.channels,
       sh.countries
 where sales.prod_id = products.prod_id
   and sales.cust_id = customers.cust_id
   and customers.country_id = countries.country_id
   and sales.time_id = times.time_id
   and sales.channel_id = channels.channel_id
   and times.calendar_month_desc in ( '2000-09',
                                      '2000-10' )
   and country_iso_code = 'US'
 group by channel_desc;