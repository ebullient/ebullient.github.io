---
aliases:
  - /articles/36/
tags:
  - blog
  - textpattern
title: 'TXP Hack: centralizing priv lookups'
source: html
---
<p>I use <span class="caps">HTTP</span> Auth for one of my Textpattern installations, and so, I wanted people that could get to the textpattern pages to have, by default, staff writer permissions.</p>
<!--more-->
<h3>Checking Privledges</h3>

<p>In Textpattern 1.0 (rc1-3), check_privs returns a message if the requested privs are not present. There is no way to non-destructively check privledges.</p>

<p>I made the following changes to lib/txp_misc.php:</p>

<pre><code>function check_privs()
{
  global $txp_user;
  $args = func_get_args();

  // Change check for privs to call new method, has_privs
  $result = call_user_func_array('has_privs', $args);

  if( !$result )
  {
    exit(pageTop('Restricted').
         '&lt;p style=&quot;margin-top:3em;text-align:center&quot;&gt;'.
         gTxt('restricted_area').'&lt;/p&gt;');
  }
}

// New method - non-desructively checks for given privs
// Also sets privs retrieved from DB in a global to reduce DB load
function has_privs()
{
  global $myprivs, $txp_user;

  if ( !isset($myprivs) || empty($myprivs) )
  {
    $myprivs = safe_field('privs', 'txp_users', &quot;name = '$txp_user'&quot;);

    // if we didn't find privs in the DB, assign default of 4 (Staff Writer)
    if ( empty($myprivs) &amp;&amp; isset($_SERVER['REMOTE_USER'])
      $myprivs = 4;
  }

  // Get requested privs, and test requested privs
  // against assigned privs..

  $args = func_get_args();

  if ( in_array($myprivs,$args) )
    return true;

  return false;
}
</code></pre>

<h3>Centralizing priv lookups.</h3>

<p>The next part is to change lookups for privs (which look something like this: </p>

<p><code>$myprivs = safe_field('privs', 'txp_users', &quot;name = '$txp_user'&quot;);</code></p>

<p>To call the new <code>has_privs</code> method instead.</p>
