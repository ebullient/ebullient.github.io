---
aliases:
  - /articles/32/rails-printing-validation-errors-as-flash-notices
tags:
  - rails
title: 'Rails: Printing validation errors as flash notices'
---
<p>I am quite sure someone has already found this simple solution, but when I poked around, I couldn't find it.</p>

<p>Here is my snippet to print out the error messages resulting from a validation as a flash notice:</p>

<pre><code>  if @user.save
    flash[:'notice'] = &quot;New user saved successfully.&quot;
  elsif !@user.errors.empty?
    flash[:'notice'] = &quot;Could not save new user: &quot;
        &lt;&lt; @user.errors.full_messages.join(&quot;; &quot;)
  end
</code></pre>
