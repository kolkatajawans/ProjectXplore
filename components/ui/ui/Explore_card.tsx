import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "./card";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button, buttonVariants } from "./button";
import {
  EllipsisVertical,
  EyeIcon,
  Heart,
  MessageSquareTextIcon,
} from "lucide-react";
import { Separator } from "./separator";
interface exploreCard {
  avatar: string;
  name: string;
  fallback: string;
  time: string;
  description: string;
  images: string[];
  likes: string;
  views: string;
  className: string;
}

const Explore_card = ({
  avatar,
  name,
  fallback,
  time,
  description,
  images,
  likes,
  views,
  className,
}: exploreCard) => {
  const [clicked, setClicked] = useState(false);
  function handleClick(event: any) {
    setClicked(!clicked);
  }
  return (
    <div>
      <Card
        className={` bg-[#DFEBFF] w-[550px] h-fit my-[50px] rounded-2xl  ${className}`}
      >
        <CardHeader className="flex flex-row items-center gap-x-4 border-b border-black">
          <div id="profile_image">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </div>
          <div id="profile_name">
            {name}
            <div id="time" className="text-[13px] text-gray-500">
              {time}
            </div>
          </div>
          <div className="flex-grow flex justify-end">
            <Button
              onClick={() => console.log("cliked")}
              className="bg-transparent text-black hover:bg-[#d8e5fc] border border-black rounded-3xl w-13 h-13 p-[3px]"
            >
              <EllipsisVertical />
            </Button>
          </div>
        </CardHeader>
        <CardDescription className="text-black font-mukta text-md px-6 py-6">
          {description}
        </CardDescription>
        <CardContent>
          <div id="image" className="flex w-full pt-3">
            <Carousel className="z-10 relative">
              <CarouselContent>
                {images.map((img) => {
                  return (
                    <CarouselItem>
                      <img
                        src={img}
                        alt=""
                        className=" rounded-md object-cover"
                      />
                      <Separator className="w-2" />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />  
            </Carousel>
          </div>
        </CardContent>
        <CardFooter className="gap-8 text-sm w-[550px] flex justify-between border-t border-black items-center pt-4">
          <div id="views" className="flex items-center text-gray-500 ">
            <EyeIcon className="mr-[2px]" size={13} />{" "}
            <p id="view_number" className="">
              {views}
            </p>
          </div>
          <div>
            {" "}
            {clicked ? (
              <Heart
                size={24}
                className="text-[#FF0046] "
                fill="#FF0046"
                onClick={handleClick}
              />
            ) : (
              <Heart size={24} onClick={handleClick} />
            )}
          </div>
          <div
            id="comments"
            className="flex items-center text-gray-500 cursor-pointer"
          >
            <MessageSquareTextIcon className=" mr-2" size={17} />
            <p className="text-[14px]">Comments</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Explore_card;
