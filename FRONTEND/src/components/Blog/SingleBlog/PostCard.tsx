import { useState } from "react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { CalendarDays, Clock, Heart, Send, BookmarkPlus } from "lucide-react";
import DOMPurify from "dompurify";
import { LikedButtonEffect } from "../../ui/buttonEffect";
import { HandleVote } from "../../../services/BlogServices";
import {
  TelegramShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from "react-share";
import telegramIcon from "../../../assets/telegram.png";
import whatsappIcon from "../../../assets/whatsapp.png";
import twitterIcon from "../../../assets/twitter.png";
import pinterestIcon from "../../../assets/pinterest.png";
import copyIcon from "../../../assets/link.png";
import { Check } from "lucide-react"; // Add the Check icon import
import NumberTicker from "../../ui/number-ticker";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { shareURL } from "../../../config/env";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt?: string;
  readTime?: string;
  category?: string;
  _count: {
    upvotes: number;
  };
}

interface PostCardProps {
  blog: Blog;
}

export const PostCard = ({ blog }: PostCardProps) => {
  const [likes, setLikes] = useState(blog._count.upvotes || 0);
  const [liked, setLiked] = useState(false);
  const [copyState, setCopyState] = useState(false); // Track copy state

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  const handleConfettiClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const newVoteType = liked ? "downvote" : "upvote";
      if (!liked) {
        LikedButtonEffect(event);
        setLikes((prevLikes: number) => prevLikes + 1);
        setLiked(true);
      } else {
        setLikes((prevLikes: number) => prevLikes - 1);
        setLiked(false);
      }
      HandleVote(blog.id.toString(), newVoteType);
    } catch (error) {
      console.error("Like button error:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareURL}/blog?id=${blog.id}`);
    setCopyState(true);
    setTimeout(() => setCopyState(false), 1200); // Reset after 1.2s
  };

  return (
    <article className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      {/* Author info and metadata */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="bg-gray-600 w-12 h-12 flex items-center justify-center text-white">
            <AvatarFallback className="text-xl font-bold text-gray-800">
              {getInitials(blog.author.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-lg text-white">
                {blog.author.name}
              </h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <span className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : new Date().toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {blog.readTime || "5 min"}
              </span>
            </div>
          </div>
        </div>

        {/* Like and Share Buttons */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleConfettiClick}
            className={`flex items-center space-x-1 bg-none ${
              liked ? "text-red-500" : "text-gray-400"
            } hover:text-red-500 rounded-full border-gray-700 border-2`}
          >
            {!liked ? (
              <Heart className="h-5 w-5" />
            ) : (
              <Heart className="h-5 w-5" fill="#F44336" />
            )}
            <NumberTicker
              value={likes ? likes : 0}
              direction="up"
              decimalPlaces={0}
              className="text-gray-400"
            />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="text-gray-400 hover:text-indigo-400 rounded-full transition-transform border-gray-700 border-2">
                <Send className="h-5 w-5" />
                <span className="text-white">Share</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-50 p-3 bg-gray-800 backdrop-blur-lg border-gray-600 border-2 rounded-full transform translate-y-2">
              <div className="flex space-x-3 justify-start items-center">
                <WhatsappShareButton url={shareURL} title={blog.title}>
                  <img
                    src={whatsappIcon}
                    alt="WhatsApp"
                    className="w-7 h-7 rounded-full mx-auto hover:scale-110 transition-transform"
                  />
                </WhatsappShareButton>
                <TelegramShareButton url={shareURL} title={blog.title}>
                  <img
                    src={telegramIcon}
                    alt="Telegram"
                    className="w-7 h-7 rounded-full mx-auto hover:scale-110 transition-transform"
                  />
                </TelegramShareButton>
                <TwitterShareButton url={shareURL} title={blog.title}>
                  <img
                    src={twitterIcon}
                    alt="Twitter"
                    className="w-7 h-7 rounded-full mx-auto hover:scale-110 transition-transform"
                  />
                </TwitterShareButton>
                <PinterestShareButton
                  url={shareURL}
                  media="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  title={blog.title}
                >
                  <img
                    src={pinterestIcon}
                    alt="Pinterest"
                    className="w-7 h-7 mx-auto hover:scale-110 transition-transform"
                  />
                </PinterestShareButton>

                <div className="relative">
                  {copyState ? (
                    <Check className="h-7 w-7 text-white scale-110 transition-transform" />
                  ) : (
                    <img
                      src={copyIcon}
                      onClick={handleCopyLink}
                      alt="Copy Link"
                      className="w-7 h-7 mx-auto cursor-pointer hover:scale-110 transition-transform"
                    />
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 border-gray-600 border-2 rounded-full"
          >
            <BookmarkPlus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Title and Content */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-4xl font-bold text-black mb-6 leading-tight">
          {blog.title}
        </h1>
        <div
          className="prose max-w-none text-black"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        ></div>
      </div>
    </article>
  );
};
