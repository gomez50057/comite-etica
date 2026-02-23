"use client";
// import HeroHacks from "@/components/shared/blogStructure/HeroHacks";
import BlogHeader from "@/components/shared/blogStructure/BlogHeader";
import BlogNoticias from "@/components/shared/blogStructure/BlogNoticias";
import { blogPosts } from "@/utils/blog/blogData";
import { categoryFilters } from "@/utils/blog/categoryFiltersBlog";

const BlogMain = () => {
  // Solo posts con featuredPosts === true
  const featuredOnly = blogPosts.filter(p => p.featuredPosts === true);

  return (
    <div>
      <BlogHeader posts={blogPosts} />
      <BlogNoticias posts={blogPosts} featuredPosts={featuredOnly} categoryFilters={categoryFilters} nameLink="blog"/>
    </div>
  );
};

export default BlogMain;
