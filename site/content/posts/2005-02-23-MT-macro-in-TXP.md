---
aliases:
  - /articles/39/
tags:
  - blog
  - textpattern
title: 'TXP Hack: MT-Macro like function in textpattern'
---
<p>This is a simple hack to add one of my favorite MT-plugins, Brad Choate's <a href="http://www.bradchoate.com/weblog/2002/08/12/mtmacro"><span class="caps">MTM</span>acros</a>, to textpattern.</p>

<p>Granted, I didn't pull the entire kaboodle. This doesn't do fun container logic and acronym matching, etc. But it does do simple string replacement, which is what I used it for (e.g. smilies and pretty attributions).</p>

<!--more-->
<p><span class="attribute">[Based on Textpattern 1.0rc1]</span></p>

<ul>
<li><a href="#classTextile">Using macros with original <code>lib/classTextile.php</code></a></li>
<li><a href="#textilePHP">Using macros with <code>TextilePHP</code></a></li>
</ul>

<h3><a name="classTextile"></a> Using macros with original <code>lib/classTextile.php</code></h3>

<p>I add one method to <code>lib/classTextile.php</code> (either the original, or the modified version provided by Colin Brown<sup class="footnote"><a href="#fn1">1</a></sup> that provides extended blocks, escaped blocks, and better handling of &lt;pre&gt; tags).</p>

<pre>
    /**
     * Performs string replacement based on a provided
     * array containing 'pattern' =&gt; 'replacement' pairs.
     *
     * @parameter string $text Text to process
     * @parameter string $list Name of global variable containing
     *                         array of pattern/replacement pairs.
     */
    function customMacros($text, $list)
    {
        $macros = $GLOBALS[$list];

        if ( isset($macros) &amp;&amp; is_array($macros) )
        {
            $patterns = array_keys($macros);
            $replace = array_values($macros);
            $text = str_replace($patterns, $replace, $text);
        }
        return $text;
    }
</pre>

<p>I added two calls to this method within the <code>TextileThis</code> method of <code>lib/classTextile.php</code>.</p>

<p>The first is just after we mark that text which should not be textiled:</p>

<pre>
    $text = $this-&gt;customMacros($text, 'pre_macros');
</pre>


<p>This expands macros before other textile substitutions.</p>

<p>The second is just before the &lt;notextile&gt; tags are replaced (it could also be just after):</p>


<pre>
    $text = $this-&gt;customMacros($text, 'post_macros');
</pre>



<p>The second parameter passed to the <code>textileMacros</code> method is the name of a global environment variable holding an array of macro definitions (e.g. pre_macros or post_macros). You can change these names to suit, but the array declaration (given what is above) should look something like this:</p>



<pre>
  global $pre_macros, $post_macros;

  $pre_macros = array(
    '=&amp;#41;'  =&gt; '&amp;lt;img src=&quot;/cheesy.gif&quot; /&gt;',
   '&amp;lt;/z&gt;' =&gt; ' &amp;lt;/q&gt;',
          );


  $post_macros = array(
    '&amp;lt;z&gt;'  =&gt; '&amp;lt;span class=&quot;attribute&quot;&gt;[',
   ' &amp;lt;/q&gt;' =&gt; ']&amp;lt;/span&gt;',
           );
</pre>



<p>I use a custom tag to generate formatted attribution text, e.g. &lt;z>"link.com":http://link.com&lt;/z> generates &lt;span class="attribute>[&lt;a href="link.com">link.com&lt;a>]&lt;/span>.</p>

<p>The combination of pre/post tags adjusts spacing to allow textpattern to properly work around my custom tag.</p>


<h3><a name="textilePHP"></a> Using macros with original <code>TextilePHP</code></h3>

<p>This also works with <a href="http://jimandlissa.com/project/textilephp">TextilePHP</a>.</p>

<p>I made the following updates to their class:</p>


<ul>
<li>Added <code>TextileThis</code>, as others have done<sup class="footnote"><a href="#fn2">2</a></sup>, to make it <span class="caps">TXP </span>compatible.</li>
<li>Added <code>customMacros</code> method, as above, with two calls for pre-textile processing, and post-textile processing.
<ul>
<li><code>$str = $this-&gt;customMacros($str, 'pre_macros');</code><br />
'pre_macros' are used just before the check for disabled html</li>
<li><code>$out = $this-&gt;customMacros($str, 'post_macros');</code><br />
'post_macros' are used just before the cleanup to<br />
restore preserved blocks.</li>
</ul>
</li>
</ul>





<pre>
  /**
   * Wrapper function for compatibility with TXP
   */
  function TextileThis($text, $lite='', $encode='', $noimage='', $strict='')
  {
    if (get_magic_quotes_gpc())
           $text = stripslashes($text);

    if ( $encode )
        return $this-&gt;encode_html_basic($text);

    if ( $lite )
        $this-&gt;disable_html(true);

    return $this-&gt;process($text);
  } // function TextileThis
</pre>



<h3>Footnotes</h3>

<p class="footnote" id="fn1"><sup>1</sup> <a href="http://www.solarorange.com/projects/textile/">Unofficial Textile 2.0 beta</a>, from <a href="http://forum.textpattern.com/viewtopic.php?id=2285">this thread</a>.</p>

<p class="footnote" id="fn2"><sup>2</sup> <a href="http://greenrift.textdrive.com/projects/9/textilephp-for-txp">TextilePHP for <span class="caps">TXP</span></a>, as mentioned in <a href="http://forum.textpattern.com/viewtopic.php?id=2059">this thread</a>.</p>
