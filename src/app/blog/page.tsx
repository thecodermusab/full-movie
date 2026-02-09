import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const featuredPost = BLOG_POSTS[0];
  const recentPosts = BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-20 mb-12">
        <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">Our Blog</Badge>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat mb-6 tracking-tight">
            Latest News & <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reviews, analysis, and updates from the world of movies and sports.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Featured Post */}
        <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Featured Story
            </h2>
          <Link href={`/blog/${featuredPost.slug}`} className="group relative block rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[2/1] border border-white/10 hover:border-primary/50 transition-colors">
             <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
             
             <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                 <div className="max-w-4xl space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{featuredPost.category}</Badge>
                        <span className="text-white/80 flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {featuredPost.date}
                        </span>
                        <span className="text-white/80 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {featuredPost.readTime}
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold font-montserrat text-white leading-tight group-hover:text-primary transition-colors">
                        {featuredPost.title}
                    </h3>
                    <p className="text-lg text-white/80 line-clamp-2 md:line-clamp-none max-w-2xl">
                        {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                <Image src={featuredPost.author.avatar} alt={featuredPost.author.name} width={40} height={40} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{featuredPost.author.name}</p>
                                <p className="text-xs text-white/60">{featuredPost.author.role}</p>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
          </Link>
        </div>

        {/* Recent Posts Grid */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            Recent Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                 <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 hover:bg-black/80">
                    {post.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                 <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                 </div>
                 
                 <h3 className="text-xl font-bold font-montserrat mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                 </h3>
                 <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                 </p>

                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                            <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} />
                         </div>
                         <span className="text-xs font-medium">{post.author.name}</span>
                    </div>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight className="w-4 h-4" />
                    </span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
