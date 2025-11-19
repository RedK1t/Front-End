import FolderItem from "./FolderItem";

export default function SidePanel() {
  return (
    <div className="mx-auto flex w-11/12 flex-col justify-end overflow-hidden py-5">
      <FolderItem id="Fawry.com" withLine={false} folderName="Fawry.com">
        <FolderItem id="Fawry.com/payments" folderName="/payments">
          <FolderItem id="Fawry.com/payments/v1" folderName="/v1"></FolderItem>
          <FolderItem id="Fawry.com/payments/v2" folderName="/v2">
            <FolderItem
              id="Fawry.com/payments/v2/checkout"
              folderName="/checkout"
            ></FolderItem>
            <FolderItem
              id="Fawry.com/payments/v2/refund"
              folderName="/refund"
            ></FolderItem>
          </FolderItem>
          <FolderItem
            id="Fawry.com/payments/webhooks"
            folderName="/webhooks"
          ></FolderItem>
        </FolderItem>
        <FolderItem id="Fawry.com/auth" folderName="/auth">
          <FolderItem
            id="Fawry.com/auth/login"
            folderName="/login"
          ></FolderItem>
          <FolderItem
            id="Fawry.com/auth/logout"
            folderName="/logout"
          ></FolderItem>
          <FolderItem
            id="Fawry.com/auth/refresh"
            folderName="/refresh"
          ></FolderItem>
        </FolderItem>
        <FolderItem id="Fawry.com/users" folderName="/users">
          <FolderItem
            id="Fawry.com/users/profile"
            folderName="/profile"
          ></FolderItem>
          <FolderItem id="Fawry.com/users/settings" folderName="/settings">
            <FolderItem
              id="Fawry.com/users/settings/notifications"
              folderName="/notifications"
            ></FolderItem>
            <FolderItem
              id="Fawry.com/users/settings/privacy"
              folderName="/privacy"
            ></FolderItem>
          </FolderItem>
        </FolderItem>
        <FolderItem id="Fawry.com/orders" folderName="/orders">
          <FolderItem
            id="Fawry.com/orders/history"
            folderName="/history"
          ></FolderItem>
          <FolderItem id="Fawry.com/orders/track" folderName="/track">
            <FolderItem
              id="Fawry.com/orders/track/realtime"
              folderName="/realtime"
            ></FolderItem>
          </FolderItem>
        </FolderItem>
      </FolderItem>
    </div>
  );
}
