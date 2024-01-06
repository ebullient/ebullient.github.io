---
aliases:
  - /articles/47/upgrading-old-rails-apps
tags:
  - rails
title: 'Upgrading old rails apps... '
---
<p>I have to say that updating RoR for old apps always lands me in some wonky funny business: missing config variables, moved whatsits and thingummies. grr. The issues aren't easy to search for, either.</p>
<!--more-->
<p>This time: </p>
<ul>
<li>Bad routing with Apache Alias: that started acting up, too. I have an app at "/app" (for example), and was mapping "/app/shortname" to one of the controllers. This worked before, post upgrade of rails, it would actually look for "/app/shortname", when only 'shortname' was in the rails routes.rb (which means the app in general didn't behave, as you clicked along, the missing prefix kept messing things up). The fix came from the item below.. upgrading passenger resolved it.</li>
<li>"Unknown method rewind"<br />Again, no effing clue why/where... just wanted to fix it so it would go away (I know, lazy, right?): Amen that <a href="http://hamishrickerby.com/2009/08/04/undefined-method-rewind-and-rails-2-3-3/">someone already figured this one out</a>... Passenger needed to be updated.</li>
<li>So, what's next? convention change... <%= render "layouts/whatever" %> now maps to apps/view/layouts/_whatever.erb instead of apps/view/layouts/whatever.rhtml. Renaming fun.</li>
</ul>

<p>Useful:</p>
<ul>
<li><a href="http://blog.zobie.com/2008/11/testing-routes-in-rails/">Testing Routes in RoR</a></li>
</ul>
