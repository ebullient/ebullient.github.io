type Contributor = {
    avatar_url: string;
    html_url: string;
    login: string;
    contributions: number;
}

export async function fetchGitHubContributors(list: string) {
    const contributorsMap: Map<string, Contributor> = new Map();
    for (const item of list.trim().split(",")) {
        const repo = item.trim();
        if (repo) {
            const result = await fetchContent(`https://api.github.com/repos/${repo}/contributors?per_page=100`);
            for(const contributor of result) {
                const previous = contributorsMap.get(contributor.login);
                if (previous) {
                    previous.contributions += contributor.contributions;
                } else {
                    contributorsMap.set(contributor.login, contributor);
                }
            }
        }
    }
    const uniqueContributors = Array.from(contributorsMap.values());
    return uniqueContributors
        ? generateContributorsHtml(uniqueContributors)
        : '<div class="ghContributors">Failed to load contributors</div>';
}

async function fetchContent(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch GitHub contributors from ${url}: ${error}`);
        return [];
    }
}

function generateContributorsHtml(contributors: Contributor[]) {
    return `
<style type="text/css">
.ghContributors{
    display:flex;
    flex-flow: wrap;
    align-content: flex-start;
}
.ghContributors > div{
    width: 50%;
    display: inline-flex;
    margin-bottom: 5px;
}
.ghContributors > div label{
    padding-left: 4px;
}
.ghContributors > div span{
    font-size: x-small;
    padding-left: 4px;
}
</style>
<div class="ghContributors">
  ${contributors.map((contributor) => `
  <div>
    <img src="${contributor.avatar_url}" class="inline" width="32" height="32" style="height: 32px; margin-bottom:.25em; vertical-align:middle;">
    <label><a href="${contributor.html_url}">@${contributor.login}</a></label>
    <span class="contributions">${contributor.contributions} commits</span>
  </div>
  `).join('')}
</div>
`;
}
