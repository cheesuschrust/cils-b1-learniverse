
import React from "react";
import EnhancedAdvertisement from "./EnhancedAdvertisement";
import { AdPosition, AdSize } from "@/types/advertisement";

interface AdvertisementProps {
  position?: AdPosition;
  size?: AdSize;
  className?: string;
  showCloseButton?: boolean;
}

const Advertisement: React.FC<AdvertisementProps> = (props) => {
  return <EnhancedAdvertisement {...props} />;
};

export default Advertisement;
