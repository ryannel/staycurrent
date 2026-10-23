# Sources placement and disclosure

User requested sources/further reading at the absolute bottom, with collapsing suggested. The preview now places the complete section after the collection map and previous/next navigation, as the final main-content element above the site footer. Native details/summary is closed by default and opens by mouse or keyboard. The original section anchor is retained.

This is an opt-in SkillTrial template feature, using a Base end-matter slot. It separates the current article’s final sources heading/content when rendering; the authored article and all eight supporting files remain byte-identical to the first return. All seven source entries and 14 links are preserved, with complete moved HTML compared against its prior rendered section (whitespace normalised). The rest of the site retains its existing default template.

Immutable preview r04 is served on loopback port4364, session29548. Normal and preview builds pass; the actual draft passes applicable existing structure checks. Mouse expansion and Enter collapse were observed; focus outline and default collapsed position were captured in collapsed-sources.png. Existing script URLs and all 57 nested article links are preserved. See collapsed-sources-check.json. No publication or article review/repair.
