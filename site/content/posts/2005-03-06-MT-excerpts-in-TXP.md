---
aliases:
  - /articles/38/
tags:
  - blog
  - textpattern
title: 'TXP Hack: Using TXP Excerpts like MT'
---
<p>One of the things I used heavily in MT was the body/extended body trick. I wanted to continue that with Textpattern, but it involved some hacks to how <span class="caps">TXP </span>handles excerpts.</p>
<!--more-->
<p><span class="attribute">[Based on Textpattern 1.0rc1]</span></p>

<ol>
<li> Add an additional column, Excerpt_html, to the textpattern table so that Excerpt has the same behavior as the body (original textile is saved, with the html result in the _html column).
  <ul>
  <li> Change to <code>txpsql.php</code>:

<pre><code>  --- txpsql.php  23 Jan 2005 02:40:40 -0000      1.1
  +++ txpsql.php  6 Feb 2005 17:44:33 -0000       1.2
  @@ -19,6 +19,7 @@
     `Body` text NOT NULL,
     `Body_html` text NOT NULL,
     `Excerpt` mediumtext NOT NULL,
  +  `Excerpt_html` mediumtext NOT NULL,
     `Image` varchar(255) NOT NULL default '',
     `Category1` varchar(128) NOT NULL default '',
     `Category2` varchar(128) NOT NULL default '',
</code></pre>

  </li>
  <li> Change to <code>_update.php</code>:

<pre><code>  --- _update.php 23 Jan 2005 02:40:40 -0000      1.1
  +++ _update.php 6 Feb 2005 17:43:05 -0000       1.2
  @@ -50,6 +50,10 @@
          if (!in_array('Excerpt',$txp)) {
                  safe_alter(&quot;textpattern&quot;, &quot;add `Excerpt` mediumtext not null after `Body_html`&quot;);
          }
  +
  +       if (!in_array('Excerpt',$txp)) {
  +               safe_alter(&quot;textpattern&quot;, &quot;add `Excerpt_html` mediumtext not null after `Excerpt`&quot;);
  +       }
</code></pre>

  </li>
  <li> In order to have _update.php run (to add the column to an existing textpattern table), temporarily change <code>$thisversion</code> in <code>textpattern/index.php</code> to '0'. _update.php will run the next time you do anything with  <code>textpattern/index.php</code>. Once it runs, return  <code>$thisversion</code> to its original value.
  </li>
  </ul>
</li>
<li>Make <code>textpattern/include/txp_article.php</code> store the raw textile text and the html formatted text separately. Also, since I am used to writing the excerpt and then the body, I moved the excerpt box above the body box on the entry form.
This diff is a little more involved, I've attached it <a href="/files/excerpt-html.txp-article.diff.txt">here</a>.<br />
</li>
<li>Finally, we need to make <code>textpattern/publish.php</code> display <code>Excerpt_html</code> instead of <code>Excerpt</code>. The diff is <a href="/files/excerpt-html.publish.diff.txt">here</a>.
</li>
</ol>

<p>For the full article display, use <code>&lt;txp:excerpt /&gt;</code> and <code>&lt;txp:body /&gt;</code>. To show just the excerpt, use <code>&lt;txp:excerpt /&gt;.</code> </p>

<p>I selectively show a "[more]" link based on whether or not there is additional body text. If an entry is really short, sometimes there is only an excerpt. I created my own plugin to do this, and it looks like this:</p>

<pre><code>function elh_article_more($atts)
{
    global $thisarticle;
    if (is_array($atts)) extract($atts);

    $body = $thisarticle['body'];
    if ( !preg_match(&quot;/w/&quot;, $body) )
        return '';

    $link = '&lt;a href=&quot;'.$thisarticle['permlink'].'&quot;&gt;more&lt;/a&gt;';

    return '&lt;div class=&quot;more&quot;&gt;['.$link.']&lt;/div&gt;';
}
</code></pre>

<p>Have Fun!</p>
