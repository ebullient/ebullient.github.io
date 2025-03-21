---
aliases:
  - /articles/31/rails-staying-away-from-enums-in-migrations
tags:
  - rails
title: 'Rails: Staying away from Enums in Migrations'
---
<p>I was fiddling with migrations, and found these regarding the use of MySQL-ish <span class="caps">ENUM</span>s in Migrations:</p>

<ul>
<li><a href="http://rails.techno-weenie.net/forums/1/topics/180">Enum fields in migrations?</a></li>
<li><a href="http://wiki.rubyonrails.com/rails/pages/HowtoUseSetAndEnumColumns">HowtoUseSetAndEnumColumns</a></li>
</ul>

<p>Basically, <span class="caps">ENUM</span>s aren't supported, and using Validations might be a good work-around, but is dependent on you putting (and keeping) all of the logic in your Rails app. If you need to go cross-app (with some other thing that ain't rails), then use <span class="caps">CHECK </span>or other DB constraints to enforce desired values.</p>
